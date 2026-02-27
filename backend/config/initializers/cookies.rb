# frozen_string_literal: true

# Middleware: Cookie Support for API-only Application
# ====================================================
# ActionController::API strips cookie middleware by default.
# We re-inject it so we can store encrypted JWT tokens in cookies
# without opening Rails' full middleware stack.

Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.middleware.use ActionDispatch::Session::CookieStore
