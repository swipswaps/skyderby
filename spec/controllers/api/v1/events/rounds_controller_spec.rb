describe Api::V1::Events::RoundsController do
  render_views

  it '#index' do
    get :index, params: { event_id: events(:published_public).id }, format: :json
    expect(response.successful?).to be_truthy

    response_json = JSON.parse(response.body)
    expect(response_json).to eq(JSON.parse(expected_response.to_json))
  end

  def expected_response
    [
      { id: 1, discipline: 'distance', number: 1 },
      { id: 2, discipline: 'speed', number: 1 }
    ]
  end
end
