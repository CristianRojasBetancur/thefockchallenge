# frozen_string_literal: true

module Api
  module V1
    class FollowsController < ApplicationController
      # POST /api/v1/users/:user_id/follow
      def create
        result = ::Follows::Creator.call(user_id: params[:user_id], current_user: current_user)

        if result.success?
          head :created
        else
          raise result.failure
        end
      end

      # DELETE /api/v1/users/:user_id/follow
      def destroy
        result = ::Follows::Destroyer.call(user_id: params[:user_id], current_user: current_user)

        if result.success?
          head :no_content
        else
          error = result.failure
          if error.is_a?(Domain::Follows::NotFoundError)
            # Safe to ignore if we're trying to unfollow but already not following
            head :no_content
          else
            raise error
          end
        end
      end

      # GET /api/v1/users/:user_id/followers
      def followers
        result = ::Follows::FollowersFetcher.call(
          user_id: params[:user_id],
          page: params[:page],
          limit: params[:limit]
        )

        if result.success?
          @users = result.value!
          render :followers, status: :ok
        else
          raise result.failure
        end
      end

      # GET /api/v1/users/:user_id/following
      def following
        result = ::Follows::FollowingFetcher.call(
          user_id: params[:user_id],
          page: params[:page],
          limit: params[:limit]
        )

        if result.success?
          @users = result.value!
          render :following, status: :ok
        else
          raise result.failure
        end
      end
    end
  end
end
