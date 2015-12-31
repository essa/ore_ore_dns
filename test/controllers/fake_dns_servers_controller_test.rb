require 'test_helper'

class FakeDnsServersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @fake_dns_server = fake_dns_servers(:one)
  end

  test "should get index" do
    get fake_dns_servers_url
    assert_response :success
  end

  test "should get new" do
    get new_fake_dns_server_url
    assert_response :success
  end

  test "should create fake_dns_server" do
    assert_difference('FakeDnsServer.count') do
      post fake_dns_servers_url, params: { fake_dns_server: { default_server: @fake_dns_server.default_server, name: @fake_dns_server.name } }
    end

    assert_redirected_to fake_dns_server_path(FakeDnsServer.last)
  end

  test "should show fake_dns_server" do
    get fake_dns_server_url(@fake_dns_server)
    assert_response :success
  end

  test "should get edit" do
    get edit_fake_dns_server_url(@fake_dns_server)
    assert_response :success
  end

  test "should update fake_dns_server" do
    patch fake_dns_server_url(@fake_dns_server), params: { fake_dns_server: { default_server: @fake_dns_server.default_server, name: @fake_dns_server.name } }
    assert_redirected_to fake_dns_server_path(@fake_dns_server)
  end

  test "should destroy fake_dns_server" do
    assert_difference('FakeDnsServer.count', -1) do
      delete fake_dns_server_url(@fake_dns_server)
    end

    assert_redirected_to fake_dns_servers_path
  end
end
