json.errors @errors.each_with_index.to_a do |error, index|
  json.message error[:message]
  json.code    error[:code]
  json.index   index
end
