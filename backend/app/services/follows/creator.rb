# frozen_string_literal: true

module Follows
  class Creator < ApplicationTransaction
    step :find_target_user
    step :create_follow

    private

    def find_target_user(input)
      user = User.find_by(id: input[:user_id]) || User.find_by(username: input[:user_id])
      return Failure(Domain::Users::NotFoundError.new) unless user

      Success(input.merge(target_user: user))
    end

    def create_follow(input)
      current_user = input[:current_user]
      target_user = input[:target_user]

      follow = Follow.find_or_initialize_by(follower: current_user, followed: target_user)
      return Success(follow) if follow.persisted?

      if follow.save
        Success(follow)
      else
        Failure(ActiveRecord::RecordInvalid.new(follow))
      end
    rescue ActiveRecord::RecordNotUnique
      follow = Follow.find_by(follower: current_user, followed: target_user)
      Success(follow)
    end
  end
end
