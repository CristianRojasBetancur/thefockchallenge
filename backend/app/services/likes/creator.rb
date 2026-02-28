# frozen_string_literal: true

module Likes
  class Creator < ApplicationTransaction
    step :create_like

    private

    def create_like(input)
      tweet = input[:tweet]
      user = input[:user]

      like = tweet.likes.find_or_initialize_by(user: user)

      # If already liked, treat it as success (idempotent)
      return Success([tweet, :ok]) if like.persisted?

      if like.save
        tweet.reload
        Success([tweet, :created])
      else
        Failure(ActiveRecord::RecordInvalid.new(like))
      end
    rescue ActiveRecord::RecordNotUnique
      tweet.reload
      Success([tweet, :ok])
    end
  end
end
