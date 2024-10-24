<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

const user = useUser()
const perpage = ref('10')
const currentPage = ref(1)
const orderstatus = ref('all')
const route = useRoute()

const month = new Date().getMonth()
const calendarDate = new CalendarDate(2024, month + 1, 0)



const startdate = ref(route.query.start || calendarDate.toDate(getLocalTimeZone()).toISOString().split('T')[0])
const enddate = ref(route.query.end || calendarDate.add({ days: 30 }).toDate(getLocalTimeZone()).toISOString().split('T')[0])

const { data, status, error, refresh } = await useFetch('/api/admin/sales', {
    key: 'orders',
    query: {
        page: currentPage,
        limit: perpage,
        status: orderstatus,
        start: startdate,
        end: enddate,
    },

})


const paginate = (page: number) => {
    currentPage.value = page
}





watch(() => route.query, () => {
    startdate.value = route.query.start || calendarDate.toDate(getLocalTimeZone()).toISOString().split('T')[0]
    enddate.value = route.query.end || calendarDate.add({ days: 30 }).toDate(getLocalTimeZone()).toISOString().split('T')[0]
})



const changeStatus = async () => {

}

const cardTypes = {
    'bkash_merchant': 'Bkash',
    'NAGAD-Nagad': 'Nagad',
    'BKASH-BKash': 'Bkash SSL',
}

const cardColors = {
    'bkash_merchant': 'bg-[#e2136e]',
    'NAGAD-Nagad': 'bg-[#ed1c25]',
    'BKASH-BKash': 'bg-[#e2133f]',
}


const exportSalesData = () => {

    // export as csv
    const csv = data.value?.courseEnrollments.map((order) => {
        return {
            Name: order.user_name,
            Phone: order.phone,
            Batch: order.user.hsc_batch,
            Institute: order.user.institute,
            Email: order.user.email,
            TransactionID: order.transactionId,
            District: order.district,
            Thana: order.thana,
            Status: order.status,
            'Total Amount': order.netPrice,
            Books: order.orderItems.map((item) => `${item.bookId ? item.book.name : item.bundle.name} x ${item.quantity}`).join(','),
            Source: order.orderItems.map((item) => item.source).join(','),
            'Purchased at': formatTime(order.paymentAt),
        }
    })
    const headers = Object.keys(csv[0])

    // @ts-ignore
    const csvData = csv.map((row) => {
        return headers.map((header) => {
            // @ts-ignore
            return row[header]
        }).join(',')
    })

    const csvString = [headers.join(','), ...csvData].join('\n')

    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sales.csv'
    a.click()
    URL.revokeObjectURL(url)
}




</script>

<template>
    <div>

        <div class="flex items-start justify-between my-3 print:hidden">
            <AppHeading title="Sales Data" />

            <div class="flex gap-5">


                <Button @click="exportSalesData">
                    <Icon name="lucide:download" class="mr-2" />
                    Export
                </Button>
            </div>

        </div>

        <div class="py-20" v-if="status == 'pending'">

            <AppLoader />

        </div>



        <div v-if="status == 'success'" class="space-y-4 bg-white border rounded-md print:hidden dark:bg-gray-800">

            <Table>
                <TableHeader>
                    <TableRow>

                        <TableHead>Name</TableHead>
                        <TableHead class="hidden md:table-cell">
                            Phone
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead class="hidden md:table-cell">
                            Total Amount
                        </TableHead>

                        <TableHead class="hidden md:table-cell">
                            Course
                        </TableHead>
                        <TableHead class="hidden md:table-cell">
                            Transaction ID
                        </TableHead>
                        <TableHead class="hidden md:table-cell">
                            Enrolled at
                        </TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="o, i in data?.courseEnrollments" :key="o.id">

                        <TableCell class="font-medium">
                            {{ o.user_name }}
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                            {{ o.phone }}
                        </TableCell>
                        <TableCell>
                            {{ o.user_email }}
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                            <div>
                                <p>
                                    Tk. {{ o.payable_amount }}
                                </p>

                            </div>
                        </TableCell>

                        <TableCell class="hidden md:table-cell">
                            {{ o.course_name }}
                        </TableCell>

                        <TableCell class="hidden md:table-cell">


                            <div>
                                <p variant="outline">
                                    {{ o.transaction_id }}
                                </p>
                                <!-- <p variant="outline">
                                    {{ o.gateway_response }}
                                </p> -->
                                <!-- <Badge variant="outline" class="text-white bg-gray-900 rounded-sm"
                                    :class="cardColors[o.gateway_response.card_type]">
                                    {{ cardTypes[o.gateway_response.card_type] || o.gateway_response.card_type }}
                                </Badge> -->
                            </div>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                            {{ formatTime(o.enrolled_at) }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div class="flex justify-between px-5 pb-5">
                <div class="text-xs text-muted-foreground">
                    Showing <strong>{{ 10 * (data?.pagination.page - 1) + 1 }}-{{ data?.pagination.page *
                        data?.pagination.limit }}</strong> of
                    <strong>{{
                        data?.pagination.totalPages
                    }}</strong>
                    products

                </div>

                <div>
                    <Pagination v-slot="{ page }" @update:page="paginate" :total="data?.pagination.totalPages"
                        :sibling-count="1" show-edges :default-page="data?.pagination.page">
                        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                            <PaginationFirst />
                            <PaginationPrev />

                            <template v-for="(item, index) in items">
                                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value"
                                    as-child>
                                    <Button class="w-10 h-10 p-0"
                                        :variant="item.value === page ? 'default' : 'outline'">
                                        {{ item.value }}
                                    </Button>
                                </PaginationListItem>
                                <PaginationEllipsis v-else :key="item.type" :index="index" />
                            </template>

                            <PaginationNext />
                            <PaginationLast />
                        </PaginationList>
                    </Pagination>
                </div>
            </div>
        </div>


    </div>
</template>

<style scoped>
@media print {
    .page-break-inside-avoid {
        page-break-inside: avoid;
    }
}
</style>
