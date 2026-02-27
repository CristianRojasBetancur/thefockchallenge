# frozen_string_literal: true

Scalar.setup do |config|
  config.page_title = "API Reference"

  spec = {
    openapi: "3.1.0",
    info: { title: "API Documentation", version: "v1" },
    paths: {},
    components: { schemas: {}, responses: {} }
  }

  # Load partials
  Dir.glob(Rails.root.join("docs", "api", "v1", "partials", "**", "*.yml")).sort.each do |file|
    partial = YAML.load_file(file, permitted_classes: [Symbol]) || {}
    spec[:components].deep_merge!(partial.deep_symbolize_keys)
  end

  # Load endpoints
  Dir.glob(Rails.root.join("docs", "api", "v1", "*.yml")).sort.each do |file|
    endpoint = YAML.load_file(file, permitted_classes: [Symbol]) || {}
    spec[:paths].deep_merge!(endpoint.deep_symbolize_keys)
  end

  config.specification = spec.to_json
end
