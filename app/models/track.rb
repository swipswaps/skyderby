require 'tracks/points'
require 'tracks/points_processor'

class Track < ActiveRecord::Base
  belongs_to :user
  belongs_to :wingsuit
  has_one :event_track
  has_many :tracksegments, :dependent => :destroy
  has_many :points, :through => :tracksegments

  attr_accessor :trackfile, :track_index

  enum kind: [:skydive, :base]
  enum visibility: [:public_track, :unlisted_track, :private_track]

  validates :name, :location, :suit, presence: true
  before_save :parse_file

  def charts_data
    track_data.trimmed.to_json.html_safe
  end

  def earth_data
    track_data.trimmed.map { |x| {:latitude => x[:latitude],
                               :longitude => x[:longitude],
                               :h_speed => x[:h_speed],
                               :elevation => x[:abs_altitude].nil? ? x[:elevation] : x[:abs_altitude]} }
                    .to_json.html_safe
  end

  def max_height
    track_data.max_h.round
  end

  def min_height
    track_data.min_h.round
  end

  def heights_data
    track_data.points.map{ |p| [p[:fl_time_abs], p[:elevation]] }.to_json.html_safe
  end

  def duration
    track_data.points.map{ |p| p[:fl_time] }.inject(0, :+)
  end

  def presentation
    "#{self.name} | #{self.suit} | #{self.comment}"
  end

  private

  def track_data
    @track_points ||= TrackPoints.new(self)
  end

  def parse_file

    if self.new_record?

      track_points = TrackPointsProcessor.process_file(trackfile[:data], trackfile[:ext], track_index)
      return false unless track_points

      record_points track_points
      set_jump_range track_points

    end

  end

  def record_points(track_points)
    trkseg = Tracksegment.create!
    self.tracksegments << trkseg

    Point.create (track_points) { |point| point.tracksegment = trkseg}
  end

  def set_jump_range(track_points)

    min_h = track_points.min_by { |x| x[:elevation] }[:elevation]
    max_h = track_points.max_by { |x| x[:elevation] }[:elevation]

    start_point = track_points.reverse.detect { |x| x[:elevation] >= (max_h - 15) }
    self.ff_start = start_point.present? ? start_point[:fl_time] : 0

    start_point = track_points.detect { |x| (x[:fl_time] > self.ff_start && x[:v_speed] > 25) }
    self.ff_start = start_point[:fl_time] if start_point.present?

    self.ff_end = track_points.detect{ |x| x[:elevation] < (min_h + 50) && x[:fl_time] > self.ff_start}[:fl_time] || track_points.last[:fl_time]

  end

end