# frozen_string_literal: true

require_relative 'data_dictionaries'
require 'base64'

module Seeds
  class UsersSeeder
    # 1x1 perfectly valid PNG pixel, base64 encoded
    TINY_PNG = Base64.decode64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==")
    
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
        
        user = User.create!(
          name: name,
          username: handle,
          email: email,
          password: "password123",
          bio: bio
        )
        
        user.avatar.attach(io: StringIO.new(TINY_PNG), filename: "avatar.png", content_type: "image/png")
      end
      
      Rails.logger.info "Seeded #{User.count} users."
    end
  end
end
