# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    
      config.vm.box = "bento/ubuntu-16.04"
    
      config.vm.network "forwarded_port", guest: 8000, host: 8000
    
      config.vm.provision :docker
      config.vm.provision :docker_compose
    end
    