# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      # GET /api/v1/users
      def index
        query = params[:query]
        
        if query.present? && query.length >= 2
          search_term = "%#{query}%"
          @users = User.where('username ILIKE :q OR name ILIKE :q', q: search_term).limit(10)
        else
          @users = []
        end
        
        render :index, status: :ok
      end

      # GET /api/v1/users/:id
      def show
        @user = User.find_by(username: params[:id]) || User.find_by(id: params[:id])
        
        if @user
          render :show, status: :ok
        else
          render json: { errors: [{ message: "User not found", code: "40402", index: 0 }] }, status: :not_found
        end
      end
    end
  end
end
