module CompetitorsHelper
  def edit_competitor_link(event, competitor, display_raw_results)
    link_to content_tag(:i, nil, class: 'fa fa-pencil'),
            edit_event_competitor_path(event, competitor),
            remote: true,
            'data-params': { 'display_raw_results' => display_raw_results }.to_param,
            class: 'edit-competitor btn-primary'
  end

  def delete_competitor_button(event, competitor, display_raw_results)
    button_to event_competitor_path(event, competitor),
              method: :delete,
              remote: true,
              params: { 'display_raw_results' => display_raw_results },
              class: 'delete-competitor btn-link' do
      content_tag(:i, nil, class: 'fa fa-times')
    end
  end
end