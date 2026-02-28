# frozen_string_literal: true

module Api
  module V1
    class ForYouTweetsController < ApplicationController
      # GET /api/v1/tweets/for_you
      def index
        result = ::ForYouTweets::Fetcher.call(
          page: params[:page],
          limit: params[:limit]
        )

        if result.success?
          @tweets = result.value!
          render :index, status: :ok
        else
          raise result.failure
        end
      end
    end
  end
end
