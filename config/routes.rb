Rails.application.routes.draw do
  resources :fake_dns_servers

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'fake_dns_servers#index'

  # Serve websocket cable requests in-process
  # mount ActionCable.server => '/cable'
end
