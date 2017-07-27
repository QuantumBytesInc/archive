from __future__ import absolute_import

import datetime
import celery
import json
import random
from PIL import Image
from django.utils.timezone import utc

from project.world.models import Terrain, Resource, ResourceLayer, ResourceSpawned, ResourceTemplate

# Set logging


@celery.decorators.periodic_task(run_every=datetime.timedelta(seconds=10))
def check_resource_respawn():
    """
    Check and respawn resources in the world.
    :return: Amount of added resources
    """
    log = check_resource_respawn.get_logger()
    log.error('Check for resources')
    amount = 0

    for terrain in Terrain.objects.all():

        # Get terrain configuration
        for resource in Resource.objects.filter(terrain=terrain):

            # Calculate total spawned resources
            if resource.amount > ResourceSpawned.objects.filter(terrain=terrain, master=resource.template).count():

                # Get image
                im = Image.open(resource.image.path)
                pix = im.load()

                # Clean image
                depleted_resources = ResourceSpawned.objects.filter(terrain=terrain, master=resource.template,
                                                                    deleted=True)

                for depleted_resource in depleted_resources:
                    pix[depleted_resource.x, depleted_resource.y] = (0,
                                                                     0,
                                                                     0,
                                                                     pix[depleted_resource.x, depleted_resource.y][3])
                    depleted_resource.delete()
                    log.error('Deleted old resource')

                # Respawn one resource per run
                while True:
                    # Get random values
                    x = random.randint(0, im.size[0] - 1)
                    y = random.randint(0, im.size[1] - 1)

                    # Check if we can spawn
                    if pix[x, y][3] > 0:  # and pix[x, y][2] == 0:
                        # Create new resource
                        newResource = ResourceSpawned.objects.create(x=x,
                                                                     y=y,
                                                                     terrain=terrain,
                                                                     master=resource.template)

                        # Add layers
                        for layer in ResourceLayer.objects.filter(resource=resource.template):
                            newResource.layers.add(ResourceLayer.objects.create(name=layer.name,
                                                                                layer=layer.layer,
                                                                                item_result=layer.item_result,
                                                                                amount=layer.amount,
                                                                                consumed=0,
                                                                                template=False,
                                                                                surface=layer.surface))

                        # Manipulate picture
                        pix[x, y] = (0,
                                     0,
                                     255,
                                     pix[x, y][3])

                        # Save
                        im.save(resource.image.path)
                        newResource.save()

                        # Broadcast to users

                        # Quit random
                        amount += 1

                        log.error('Spawning new resource at ' + str(x) + '/' + str(y))
                        break
    return amount
