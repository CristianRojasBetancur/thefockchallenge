# frozen_string_literal: true

module Likes
  class Destroyer < ApplicationTransaction
    step :destroy_like

    private

    def destroy_like(input)
      tweet = input[:tweet]
      user = input[:user]

      like = tweet.likes.find_by(user: user)

      if like
        like.destroy
        tweet.reload
      end

      # Idempotent: success whether it was deleted or didn't exist
      Success(tweet)
    end
  end
end
