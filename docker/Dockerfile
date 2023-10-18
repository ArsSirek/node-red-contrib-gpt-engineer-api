FROM python:3.10-slim


RUN apt-get update \
 && apt-get install -y sudo tk tcl

WORKDIR /app

RUN sudo python -m pip install gpt-engineer

RUN sudo sudo apt-get install -y openssh-server

# Set up a user for SSH
RUN useradd -rm -d /home/sshuser -s /bin/bash -g root -G sudo -u 1000 sshuser
RUN echo 'sshuser:password' | chpasswd
RUN mkdir /run/sshd  # Create the missing directory
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose SSH port
EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]