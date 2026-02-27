# frozen_string_literal: true

module Api
  module V1
    class TweetsController < ApplicationController
      # POST /api/v1/tweets
      def create
        result = ::Tweets::Creator.call(content: tweet_params[:content], user: current_user)

        if result.success?
          @tweet = result.value!
          render :create, status: :created
        else
          raise result.failure
        end
      end

      # DELETE /api/v1/tweets/:id
      def destroy
        result = ::Tweets::Destroyer.call(tweet_id: params[:id], current_user: current_user)

        if result.success?
          head :no_content
        else
          raise result.failure
        end
      end

      private

      def tweet_params
        params.fetch(:tweet, {}).permit(:content)
      end
    end
  end
end
