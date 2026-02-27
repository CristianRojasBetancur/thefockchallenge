# frozen_string_literal: true

module Follows
  class FollowersFetcher < ApplicationTransaction
    step :extract_params
    step :find_target_user
    step :query_followers

    private

    def extract_params(input)
      page = [ (input[:page] || 1).to_i, 1 ].max
      limit = [ (input[:limit] || 20).to_i, 100 ].min
      offset = (page - 1) * limit

      Success(input.merge(offset: offset, limit: limit))
    end

    def find_target_user(input)
      user = User.find_by(id: input[:user_id]) || User.find_by(username: input[:user_id])
      return Failure(Domain::Users::NotFoundError.new) unless user

      Success(input.merge(target_user: user))
    end

    def query_followers(input)
      target_user = input[:target_user]
      offset = input[:offset]
      limit = input[:limit]

      followers = target_user.followers
                             .order("follows.created_at DESC")
                             .offset(offset)
                             .limit(limit)

      Success(followers)
    end
  end
end
