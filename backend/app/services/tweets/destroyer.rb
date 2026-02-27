# frozen_string_literal: true

module Tweets
  class Destroyer < ApplicationTransaction
    step :find
    step :authorize
    step :destroy

    private

    def find(input)
      tweet = Tweet.find_by(id: input[:tweet_id])
      if tweet
        Success(tweet:, current_user: input[:current_user])
      else
        Failure(Domain::Tweets::NotFoundError.new)
      end
    end

    def authorize(input)
      tweet = input[:tweet]
      if tweet.user_id == input[:current_user].id
        Success(tweet)
      else
        Failure(Authorization::Tweets::ForbiddenError.new)
      end
    end

    def destroy(tweet)
      tweet.destroy
      Success(tweet)
    end
  end
end
