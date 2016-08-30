if __name__ == "__main__":
    import subprocess
    from time import sleep
    import multiprocessing, inotify.adapters
    try:
        process = subprocess.Popen(["bash", "-c", """cd ClientApp; tsc -w"""])
        p = subprocess.Popen(["python3", "server.py"])

        i = inotify.adapters.Inotify()

        i.add_watch('server.py'.encode('utf-8')) 

        try:
            for event in i.event_gen():
                if event is not None and event[-3] == ['IN_CLOSE_WRITE']:
                    p.terminate()
                    p = subprocess.Popen(["python3", "server.py"])
        except KeyboardInterrupt:
            pass
        finally:
            i.remove_watch('server.py'.encode('utf-8'))

    finally:
        p.terminate()
        process.terminate()

        sleep(1)
        process.kill()
        p.kill()
