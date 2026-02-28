# frozen_string_literal: true

module Api
  module V1
    class UserTweetsController < ApplicationController
      # GET /api/v1/users/:user_id/tweets
      def index
        result = ::UserTweets::Fetcher.call(
          user_id: params[:id],
          page: params[:page],
          limit: params[:limit],
          filter: params[:filter]
        )

        if result.success?
          @tweets = result.value!
          render :index, status: :ok
        else
          errors = result.failure
          render json: { errors: errors }, status: :not_found
        end
      end
    end
  end
end
