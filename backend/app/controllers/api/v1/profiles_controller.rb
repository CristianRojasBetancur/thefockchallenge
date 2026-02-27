# frozen_string_literal: true

module Api
  module V1
    class ProfilesController < ApplicationController
      # GET /api/v1/profile
      def show
        render json: UserSerializer.new(current_user).as_json, status: :ok
      end

      # PATCH /api/v1/profile
      def update
        if current_user.update(profile_params)
          render json: UserSerializer.new(current_user).as_json, status: :ok
        else
          render json: { errors: current_user.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/profile/avatar
      def destroy_avatar
        current_user.avatar.purge_later if current_user.avatar.attached?
        render json: { message: "Avatar removed" }, status: :ok
      end

      # DELETE /api/v1/profile/banner
      def destroy_banner
        current_user.banner.purge_later if current_user.banner.attached?
        render json: { message: "Banner removed" }, status: :ok
      end

      private

      def profile_params
        params.require(:user).permit(
          :name,
          :bio,
          :location,
          :website,
          :date_of_birth,
          :avatar,
          :banner
        )
      end
    end
  end
end
