# frozen_string_literal: true

module Auth
  class RegistrationsController < ApplicationController
    skip_before_action :authenticate_user!

    # POST /auth/register
    def create
      user = User.new(registration_params)
      user.save!

      cookie_store.write(user.generate_jwt)
      render json: UserSerializer.new(user).as_json, status: :created
    end

    private

    def registration_params
      params.require(:user).permit(
        :email,
        :username,
        :handle,
        :name,
        :password,
        :password_confirmation,
        :date_of_birth
      )
    end
  end
end
