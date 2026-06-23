<script lang="ts" setup>
import { Check, ChevronsUpDown } from '@lucide/vue'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import OverflowTooltip from '@/components/OverflowTooltip.vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type SettingSelectItem = string | { label: string; value: string }

const props = defineProps<{
  ariaDescribedby?: string
  ariaLabelledby?: string
  items: SettingSelectItem[]
}>()

const model = defineModel<string>({ required: true })

const open = shallowRef(false)

const normalizedItems = computed(() =>
  props.items.map(item =>
    typeof item === 'string' ? { label: item, value: item } : item,
  ),
)
const selectedItem = computed(() =>
  normalizedItems.value.find(item => item.value === model.value),
)
const isNativeSelect = computed(() => normalizedItems.value.length <= 20)
const searchLabel = computed(() => i18n.t('searchItems'))

function selectItem(value: string) {
  model.value = value
  open.value = false
}
</script>

<template>
  <Select
    v-model="model"
    v-if="isNativeSelect"
  >
    <SelectTrigger
      :aria-describedby="props.ariaDescribedby"
      :aria-labelledby="props.ariaLabelledby"
      class="w-56"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="item in normalizedItems"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </SelectItem>
    </SelectContent>
  </Select>

  <Popover
    v-model:open="open"
    v-else
  >
    <PopoverTrigger as-child>
      <Button
        :aria-describedby="props.ariaDescribedby"
        :aria-expanded="open"
        :aria-labelledby="props.ariaLabelledby"
        class="w-56 justify-between"
        role="combobox"
        variant="outline"
      >
        <OverflowTooltip
          :text="selectedItem?.label ?? model"
          class="min-w-0 flex-1 text-left"
        />
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      class="w-56 p-0"
    >
      <Command>
        <CommandInput :placeholder="searchLabel" />
        <CommandList>
          <CommandEmpty>{{ i18n.t('noItemsFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              @select="selectItem(item.value)"
              v-for="item in normalizedItems"
              :key="item.value"
              :value="item.value"
            >
              <OverflowTooltip
                :text="item.label"
                class="min-w-0 flex-1"
              />
              <Check
                :class="
                  cn(
                    'ml-auto size-4',
                    model === item.value ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
