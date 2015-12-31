require 'test_helper'

class LogMessagesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get log_messages_index_url
    assert_response :success
  end

end
