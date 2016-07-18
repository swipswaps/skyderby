# == Schema Information
#
# Table name: sections
#
#  id       :integer          not null, primary key
#  name     :string(510)
#  order    :integer
#  event_id :integer
#

class Section < ActiveRecord::Base
  belongs_to :event
  has_many :competitors, dependent: :restrict_with_error

  validates_presence_of :name
  validates_presence_of :event

  before_create :set_order

  def first_position?
    self.order == min_order_within_event
  end

  def last_position?
    self.order == max_order_within_event
  end

  def move_upper
    return unless higher_section  
    swap_position_with higher_section
  end

  def move_lower
    return unless lower_section
    swap_position_with lower_section
  end

  private

  def swap_position_with(other_section)
    tmp_order = order
    self.update_columns(order: other_section.order)
    other_section.update_columns(order: tmp_order) 
  end

  def lower_section
    @lower_section ||= 
      Section.where('sections.order > ?', order)
             .where(event_id: event_id)
             .limit(1)
             .order(:order)
             .first
  end

  def higher_section
    @higher_section ||=
      Section.where('sections.order < ?', order)
             .where(event_id: event_id)
             .limit(1)
             .order('sections.order DESC')
             .first
  end

  def set_order
    # Для классов в соревновании устанавливается порядок для возможности ручной
    # сортировки
    self.order = max_order_within_event + 1
  end

  def max_order_within_event
    Section.where(event_id: event_id).maximum(:order) || 0
  end

  def min_order_within_event
    Section.where(event_id: event_id).minimum(:order) || 0
  end
end
