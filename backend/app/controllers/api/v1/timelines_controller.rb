# frozen_string_literal: true

module Api
  module V1
    class TimelinesController < ApplicationController
      # GET /api/v1/timeline
      def index
        result = ::Timelines::Fetcher.call(
          current_user: current_user,
          page: params[:page],
          limit: params[:limit]
        )

        @tweets = result.value!
      end
    end
  end
end
