'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios, { AxiosResponse } from 'axios'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FileUpload from '../file-upload'
import { useModal } from '@/hooks/use-modal-store'
import { Server } from '@prisma/client'

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Please enter a name' }),
  imageUrl: z.string().nonempty({ message: 'Please enter a image url' })
})

interface ServerResponse {
  server: {
    id: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const CreateServerModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'createServer';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/servers", values);

      const server : Server = response.data;
      
      form.reset()
      router.refresh()
      router.push(`/servers/${server?.id}`);
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='bg-primary-600 px-6 pt-8'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Setup your server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a name and invite your friends to join.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'
            autoComplete='true'>
            <div className='space-y-8 p-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/90 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter a server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button
                type='submit'
                variant='primary'
                className='w-full'
                disabled={isLoading}
              >
                Create Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
