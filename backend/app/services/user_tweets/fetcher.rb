# frozen_string_literal: true

module UserTweets
  class Fetcher < ApplicationTransaction
    step :extract_params
    step :query_tweets

    private

    def extract_params(input)
      user_id = input[:user_id]
      return Failure(base: "User must be provided") unless user_id

      page = [ (input[:page] || 1).to_i, 1 ].max
      limit = [ (input[:limit] || 20).to_i, 100 ].min
      offset = (page - 1) * limit

      Success(user_id:, offset:, limit:)
    end

    def query_tweets(input)
      # Check if user exists? Actually just finding by user_id
      user = User.find_by(id: input[:user_id]) || User.find_by(username: input[:user_id])
      
      return Failure([{ message: "User not found", code: "40402", index: 0 }]) unless user

      tweets = Tweet.includes(:user)
                    .where(user_id: user.id)
                    .order(created_at: :desc)
                    .limit(input[:limit])
                    .offset(input[:offset])

      Success(tweets)
    end
  end
end
