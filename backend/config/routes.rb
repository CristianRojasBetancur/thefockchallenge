Rails.application.routes.draw do
  mount Scalar::UI, at: "/docs"

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :auth do
    post   "register", to: "registrations#create"
    post   "login",    to: "sessions#create"
    delete "logout",   to: "sessions#destroy"
  end

  namespace :api do
    namespace :v1 do
      resource :profile, only: %i[show update] do
        delete :avatar, on: :member, action: :destroy_avatar
        delete :banner, on: :member, action: :destroy_banner
      end
    end
  end
end
