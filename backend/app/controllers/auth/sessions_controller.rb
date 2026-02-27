# frozen_string_literal: true

module Auth
  class SessionsController < ApplicationController
    skip_before_action :authenticate_user!, only: :create

    # POST /auth/login
    def create
      user = User.find_by(email: login_params[:email]&.downcase&.strip)

      unless user&.authenticate(login_params[:password])
        raise Authentication::Errors::InvalidCredentials
      end

      cookie_store.write(user.generate_jwt)

      render json: UserSerializer.new(user).as_json, status: :ok
    end

    # DELETE /auth/logout
    def destroy
      cookie_store.delete

      render json: { message: "Logged out successfully" }, status: :ok
    end

    private

    def login_params
      params.require(:session).permit(:email, :password)
    end
  end
end
