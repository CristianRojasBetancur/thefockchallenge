require "test_helper"

class ErrorMessageBuilderTest < ActiveSupport::TestCase
  test ".build returns correct I18n string given a valid path" do
    result = ErrorMessageBuilder.build(path: "domain.errors.generic.internal_server_error")
    
    assert_equal "Error interno del servidor", result[:message]
    assert_equal "50001", result[:code]
  end

  test ".build raises I18n::MissingTranslationData for a missing path" do
    assert_raises(I18n::MissingTranslationData) do
      ErrorMessageBuilder.build(path: "domain.errors.invalid_path.missing")
    end
  end
end
