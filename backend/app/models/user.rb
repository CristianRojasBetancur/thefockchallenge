# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  bio             :string(160)
#  date_of_birth   :date
#  email           :string           default(""), not null
#  followers_count :integer          default(0), not null
#  following_count :integer          default(0), not null
#  handle          :string           default(""), not null
#  location        :string(100)
#  name            :string
#  password_digest :string           default(""), not null
#  tweets_count    :integer          default(0), not null
#  username        :string           default(""), not null
#  verified        :boolean          default(FALSE), not null
#  website         :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email     (email) UNIQUE
#  index_users_on_handle    (handle) UNIQUE
#  index_users_on_username  (username) UNIQUE
#
class User < ApplicationRecord
  has_one_attached :avatar
  has_one_attached :banner
  has_secure_password

  has_many :tweets, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_tweets, through: :likes, source: :tweet

  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy
  has_many :passive_follows, class_name: "Follow", foreign_key: "followed_id", dependent: :destroy

  has_many :following, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower

  validates :email,
            presence:   true,
            uniqueness: { case_sensitive: false },
            format:     { with: URI::MailTo::EMAIL_REGEXP }

  validates :password,
            length:     { minimum: 8 },
            if:         :password_required?

  validates :username,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: 3, maximum: 50 },
            format:     { with: /\A[a-zA-Z0-9_]+\z/, message: "only letters, numbers and underscores" }

  validates :handle,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: 3, maximum: 50 },
            format:     { with: /\A[a-zA-Z0-9_]+\z/, message: "only letters, numbers and underscores" }

  validates :name,     length: { maximum: 100 }, allow_blank: true
  validates :bio,      length: { maximum: 160 }, allow_blank: true
  validates :location, length: { maximum: 100 }, allow_blank: true
  validates :website,  length: { maximum: 255 }, allow_blank: true

  validate :avatar_content_type_and_size, if: -> { avatar.attached? }
  validate :banner_content_type_and_size, if: -> { banner.attached? }

  before_save :normalize_email
  before_validation :normalize_handle, on: :create

  def generate_jwt
    JsonWebToken.encode({ sub: id })
  end

  def self.from_jwt(token)
    payload = JsonWebToken.decode(token)
    user = find_by(id: payload[:sub])
    raise Authentication::Errors::UserNotFound unless user

    user
  end

  private

  def normalize_email
    self.email = email.downcase.strip
  end

  def normalize_handle
    self.handle = username.downcase.strip if handle.blank? && username.present?
  end

  def password_required?
    password_digest.blank? || password.present?
  end

  ALLOWED_IMAGE_TYPES = %w[image/png image/jpg image/jpeg image/webp].freeze

  def avatar_content_type_and_size
    validate_attachment(:avatar, max_size: 5.megabytes)
  end

  def banner_content_type_and_size
    validate_attachment(:banner, max_size: 10.megabytes)
  end

  def validate_attachment(attachment_name, max_size:)
    attachment = public_send(attachment_name)
    blob = attachment.blob

    unless ALLOWED_IMAGE_TYPES.include?(blob.content_type)
      errors.add(attachment_name, "must be a PNG, JPG, JPEG or WebP image")
    end

    if blob.byte_size > max_size
      errors.add(attachment_name, "must be smaller than #{max_size / 1.megabyte} MB")
    end
  end
end
