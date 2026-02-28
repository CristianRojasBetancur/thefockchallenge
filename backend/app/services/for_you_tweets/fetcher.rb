# frozen_string_literal: true

module ForYouTweets
  class Fetcher < ApplicationTransaction
    step :extract_params
    step :query_tweets

    private

    def extract_params(input)
      page = [ (input[:page] || 1).to_i, 1 ].max
      limit = [ (input[:limit] || 20).to_i, 100 ].min
      offset = (page - 1) * limit

      Success(offset:, limit:)
    end

    def query_tweets(input)
      tweets = Tweet.includes(:user)
                    .order(created_at: :desc)
                    .limit(input[:limit])
                    .offset(input[:offset])

      Success(tweets)
    end
  end
end
