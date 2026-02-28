# frozen_string_literal: true

require_relative 'data_dictionaries'

module Seeds
  class UsersSeeder
    def self.seed!(num_users: 100)
      Rails.logger.info "Seeding #{num_users} users..."

      names = Seeds::DataDictionaries::NAMES.shuffle
      bios = Seeds::DataDictionaries::BIOS

      num_users.times do |i|
        name_idx = i % names.length
        base_name = names[name_idx]

        suffix = (i / names.length) > 0 ? (i / names.length).to_s : ""
        name = "#{base_name}#{suffix}"

        base_handle = base_name.downcase.gsub(/[^a-z0-9]/, '_')
        handle = "#{base_handle}#{i}#{suffix}"

        email = "user#{i}@example.com"
        bio = bios.sample

        User.create!(
          name: name,
          username: handle,
          email: email,
          password: "password123",
          bio: bio
        )
      end

      Rails.logger.info "Seeded #{User.count} users."
    end
  end
end
