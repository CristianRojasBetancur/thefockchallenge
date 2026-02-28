# frozen_string_literal: true

module Api
  module V1
    class ExploreUsersController < ApplicationController
      # GET /api/v1/users/explore
      def index
        result = ::ExploreUsers::Fetcher.call(
          current_user: current_user,
          page: params[:page],
          limit: params[:limit]
        )

        if result.success?
          @users = result.value!
          render :index, status: :ok
        else
          raise result.failure
        end
      end
    end
  end
end
