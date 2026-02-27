# frozen_string_literal: true

module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  private

  def authenticate_user!
    token = cookie_store.read
    raise Authentication::Errors::InvalidToken if token.blank?

    @current_user = User.from_jwt(token)
  end

  def current_user
    @current_user
  end

  def cookie_store
    @cookie_store ||= Authentication::CookieStore.new(cookies)
  end
end
