# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      before_action :set_tweet

      # POST /api/v1/tweets/:tweet_id/like
      def create
        result = ::Likes::Creator.call(tweet: @tweet, user: current_user)

        if result.success?
          @tweet, status = result.value!
          render "api/v1/tweets/create", status: status
        else
          # Let the generic error handler capture it unless we want to return the tweet directly for idempotency
          # which the service will handle by returning Success(tweet) actually.
          raise result.failure
        end
      end

      # DELETE /api/v1/tweets/:tweet_id/like
      def destroy
        result = ::Likes::Destroyer.call(tweet: @tweet, user: current_user)

        if result.success?
          @tweet = result.value!
          render "api/v1/tweets/create", status: :ok
        else
          raise result.failure
        end
      end

      private

      def set_tweet
        @tweet = Tweet.find(params[:tweet_id])
      rescue ActiveRecord::RecordNotFound
        raise Domain::Tweets::NotFoundError
      end
    end
  end
end
