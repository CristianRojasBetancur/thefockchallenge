# frozen_string_literal: true

module Auth
  class RegistrationsController < ApplicationController
    skip_before_action :authenticate_user!

    # POST /auth/register
    def create
      user = User.new(registration_params)

      if user.save
        cookie_store.write(user.generate_jwt)
        render json: UserSerializer.new(user).as_json, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
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
