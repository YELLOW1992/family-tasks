import paramiko
import os

# 服务器信息
hostname = '118.196.117.4'
username = 'root'
password = 'zhiwu183.'
remote_path = '/var/www/html/'
local_path = 'dist/'

# 创建SSH客户端
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print('连接服务器...')
    ssh.connect(hostname, username=username, password=password)

    # 创建SFTP客户端
    sftp = ssh.open_sftp()

    # 清空远程目录
    print('清空远程目录...')
    stdin, stdout, stderr = ssh.exec_command(f'rm -rf {remote_path}*')
    stdout.channel.recv_exit_status()

    # 上传所有文件
    print('上传文件...')
    for root, dirs, files in os.walk(local_path):
        for filename in files:
            local_file = os.path.join(root, filename)
            relative_path = os.path.relpath(local_file, local_path)
            remote_file = os.path.join(remote_path, relative_path).replace('\\', '/')

            # 创建远程目录
            remote_dir = os.path.dirname(remote_file)
            try:
                sftp.stat(remote_dir)
            except:
                ssh.exec_command(f'mkdir -p {remote_dir}')

            print(f'上传: {relative_path}')
            sftp.put(local_file, remote_file)

    print('上传完成！')

except Exception as e:
    print(f'错误: {e}')
finally:
    sftp.close()
    ssh.close()
