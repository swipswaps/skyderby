class ParticipationForm < ActiveRecord::Base
  enum status: [ :active, :approved, :declined ]

  belongs_to :user
  belongs_to :event
  belongs_to :wingsuit
  has_one :competitor
end