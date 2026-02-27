class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email,           null: false, default: ""
      t.string :password_digest, null: false, default: ""

      t.string :username,        null: false, default: ""
      t.string :handle,          null: false, default: ""

      t.string  :name
      t.string  :bio,            limit: 160
      t.string  :location,       limit: 100
      t.string  :website,        limit: 255
      t.date    :date_of_birth

      t.boolean :verified,        null: false, default: false
      t.integer :followers_count, null: false, default: 0
      t.integer :following_count, null: false, default: 0
      t.integer :tweets_count,    null: false, default: 0

      t.timestamps
    end

    add_index :users, :email,    unique: true
    add_index :users, :username, unique: true
    add_index :users, :handle,   unique: true
  end
end
