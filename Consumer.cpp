#include <fcntl.h>
#include <sys/shm.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>


int main(int argc, char const *argv[])
{
	printf("XDDDDDDDDDDDDDDDDDDDDDDDDDDD");
	const char *name = "OS"; 
	const int SIZE = 4096; 
	int shm_fd;
	void *ptr;
	int i;
	/* open the shared memory segment */
	shm_fd = shm_open(name, O_RDONLY, 1234); 
	if (shm_fd == -1) 
	{
		printf("shared memory failed\n");
		exit(-1);
	}
	if (ptr == MAP_FAILED) 
	{
		printf("Map failed\n");
		exit(-1);
	}
	printf("%s",ptr);
	if (shm_unlink(name) == -1) 
	{
		printf("Error removing %s\n",name); 
		exit(-1);
	}

	return 0;
}