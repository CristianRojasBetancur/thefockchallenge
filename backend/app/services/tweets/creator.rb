# frozen_string_literal: true

module Tweets
  class Creator < ApplicationTransaction
    step :validate
    step :create

    private

    def validate(input)
      tweet = Tweet.new(content: input[:content], user: input[:user])
      if tweet.valid?
        Success(tweet)
      else
        Failure(ActiveRecord::RecordInvalid.new(tweet))
      end
    end

    def create(tweet)
      if tweet.save
        Success(tweet)
      else
        Failure(ActiveRecord::RecordInvalid.new(tweet))
      end
    end
  end
end
