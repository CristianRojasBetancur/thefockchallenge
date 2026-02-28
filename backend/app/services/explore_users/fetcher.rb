# frozen_string_literal: true

module ExploreUsers
  class Fetcher < ApplicationTransaction
    step :extract_params
    step :query_users

    private

    def extract_params(input)
      current_user = input[:current_user]
      page = [ (input[:page] || 1).to_i, 1 ].max
      limit = [ (input[:limit] || 20).to_i, 100 ].min
      offset = (page - 1) * limit

      Success(current_user:, offset:, limit:)
    end

    def query_users(input)
      current_user = input[:current_user]

      users = User.where.not(id: current_user.id)
                  .order(created_at: :desc, id: :desc)
                  .limit(input[:limit])
                  .offset(input[:offset])

      Success(users)
    end
  end
end
