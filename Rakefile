# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

ENV['RAILS_ENV'] = 'production'

Rails.application.load_tasks

desc "export db"
task :export do
  db = "db/production.sqlite3"
  backup = "/db/oreoredns.sql"
  puts "exporting #{db} to #{backup}..."
  system "echo 'delete from log_messages;' | sqlite3 #{db}"
  system "rm #{backup}"
  puts "echo '.dump' | sqlite3 #{db} > #{backup}"
  system "echo '.dump' | sqlite3 #{db} > #{backup}"
  puts "done"
end

desc "import db"
task :import do
  db = "/db/production.sqlite3"
  backup = "/db/oreoredns.sql"
  puts "importing #{db} from #{backup}..."
  system "rm #{db} && sqlite3 #{db} < #{backup}"
  puts "done"
end
