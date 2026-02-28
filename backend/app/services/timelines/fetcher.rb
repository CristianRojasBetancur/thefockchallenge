# frozen_string_literal: true

module Timelines
  class Fetcher < ApplicationTransaction
    step :extract_params
    step :query_tweets

    private

    def extract_params(input)
      current_user = input[:current_user]

      page = [ (input[:page] || 1).to_i, 1 ].max
      limit = [ (input[:limit] || 20).to_i, 100 ].min
      offset = (page - 1) * limit

      Success(current_user:, offset:, limit:)
    end

    def query_tweets(input)
      current_user = input[:current_user]
      user_ids = current_user.following.pluck(:id)

      tweets = Tweet.includes(:user)
                    .where(user_id: user_ids)
                    .order(created_at: :desc)
                    .limit(input[:limit])
                    .offset(input[:offset])

      Success(tweets)
    end
  end
end
