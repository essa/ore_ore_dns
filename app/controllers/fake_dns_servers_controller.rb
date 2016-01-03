class FakeDnsServersController < ApplicationController
  before_action :set_fake_dns_server, only: [:show, :edit, :update, :destroy]

  # GET /fake_dns_servers
  # GET /fake_dns_servers.json
  def index
    @fake_dns_servers = FakeDnsServer.all
  end

  # GET /fake_dns_servers/1
  # GET /fake_dns_servers/1.json
  def show
  end

  # GET /fake_dns_servers/new
  def new
    @fake_dns_server = FakeDnsServer.new
  end

  # GET /fake_dns_servers/1/edit
  def edit
  end

  # POST /fake_dns_servers
  # POST /fake_dns_servers.json
  def create
    @fake_dns_server = FakeDnsServer.new(fake_dns_server_params)

    respond_to do |format|
      if @fake_dns_server.save
        format.html { redirect_to @fake_dns_server, notice: 'Fake dns server was successfully created.' }
        format.json { render :show, status: :created, location: @fake_dns_server }
      else
        format.html { render :new }
        format.json { render json: @fake_dns_server.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fake_dns_servers/1
  # PATCH/PUT /fake_dns_servers/1.json
  def update
    respond_to do |format|
      if @fake_dns_server.update(fake_dns_server_params)
        format.html { redirect_to @fake_dns_server, notice: 'Fake dns server was successfully updated.' }
        format.json { render :show, status: :ok, location: @fake_dns_server }
      else
        format.html { render :edit }
        format.json { render json: @fake_dns_server.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fake_dns_servers/1
  # DELETE /fake_dns_servers/1.json
  def destroy
    @fake_dns_server.destroy
    respond_to do |format|
      format.html { redirect_to fake_dns_servers_url, notice: 'Fake dns server was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fake_dns_server
      @fake_dns_server = FakeDnsServer.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fake_dns_server_params
      params.require(:fake_dns_server).permit(:name, :target_server, :upstream, :hooking_hostnames)
    end
end
