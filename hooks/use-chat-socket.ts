/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSocket } from "@/components/providers/socket-provider";
import { MessageWithMemberWithProfile } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      // optimistic udpate
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                // update the message
                return message;
              }
              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // when creating new message, if no old data, then just add the new message to the pages
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {

        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }],
          };
        }

        const newData = [...oldData.pages];

        // append the new message to the first page
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };

        // const firstPage = oldData.pages[0];

        // if (firstPage) {
        //   const newPage = {
        //     pageParams: oldData.pageParams,
        //     pages: [
        //       {
        //         items: [message, ...firstPage.items],
        //         nextCursor: firstPage.nextCursor,
        //       },
        //       ...oldData.pages.slice(1),
        //     ],
        //   };
        //   console.log(newPage);
        //   return newPage;
        // }
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, updateKey, queryKey, queryClient, socket]);
};
