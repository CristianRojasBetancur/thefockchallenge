# frozen_string_literal: true

module Follows
  class Destroyer < ApplicationTransaction
    step :find_target_user
    step :find_follow_relationship
    step :destroy_follow

    private

    def find_target_user(input)
      user = User.find_by(id: input[:user_id]) || User.find_by(username: input[:user_id])
      return Failure(Domain::Users::NotFoundError.new) unless user

      Success(input.merge(target_user: user))
    end

    def find_follow_relationship(input)
      current_user = input[:current_user]
      target_user = input[:target_user]

      follow = Follow.find_by(follower: current_user, followed: target_user)
      return Failure(Domain::Follows::NotFoundError.new) unless follow

      Success(input.merge(follow: follow))
    end

    def destroy_follow(input)
      follow = input[:follow]
      follow.destroy!

      Success(follow)
    end
  end
end
