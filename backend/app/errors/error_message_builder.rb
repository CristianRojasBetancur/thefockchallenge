# frozen_string_literal: true

# Resolves error translations from the I18n locale files.
#
# Usage:
#   ErrorMessageBuilder.build(
#     path: "domain.errors.authentication.invalid_credentials"
#   )
#   # => { message: "Correo o contraseña incorrectos", code: "40101" }
#
# The +path+ must point to a locale node that contains both a +message+ and a
# +code+ key.  Interpolation placeholders inside +message+ are resolved via
# the optional +details+ hash.
class ErrorMessageBuilder
    # @param path    [String] dot-separated I18n key (relative to locale root)
    # @param details [Hash]   interpolation variables (e.g. { model: "Usuario" })
    # @return [Hash] { message: String, code: String }
    def self.build(path:, details: {})
      translation = I18n.t(path, raise: true)

      message = I18n.t("#{path}.message", **details, raise: true)
      code    = translation.fetch(:code) { raise KeyError, "Missing 'code' at #{path}" }

      { message: message, code: code.to_s }
    end
end
