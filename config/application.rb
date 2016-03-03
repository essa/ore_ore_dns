require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module OreOreDns
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.action_view.field_error_proc = proc { |html_tag, instance| "<span class='field-with-errors'>#{html_tag}</span>".html_safe }
    #config.web_console.whitelisted_ips = %w(192.168.0.0/16 10.0.0.0/8) 
  end
end
